package com.bankingsystem.dto;

public class RegionalManagerDto {

    // Regional Manager fields
    private Integer rmId;
    private Integer userId;
    private String address;

    // User fields
    private String username;
    private String password;
    private String email;
    private String phone;
    private String fullName;
    private String role;
    private String status;
    private String uploadedDocs;
    private byte[] profileImage;

    public RegionalManagerDto() {}

    public static Builder builder() {
        return new Builder();
    }

    // ---------------- BUILDER ----------------
    public static class Builder {

        private Integer rmId;
        private Integer userId;
        private String address;

        private String username;
        private String password;
        private String email;
        private String phone;
        private String fullName;
        private String role;
        private String status;
        private String uploadedDocs;
        private byte[] profileImage;

        public Builder rmId(Integer rmId) { this.rmId = rmId; return this; }
        public Builder userId(Integer userId) { this.userId = userId; return this; }
        public Builder address(String address) { this.address = address; return this; }

        public Builder username(String username) { this.username = username; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder uploadedDocs(String uploadedDocs) { this.uploadedDocs = uploadedDocs; return this; }
        public Builder profileImage(byte[] profileImage) { this.profileImage = profileImage; return this; }

        public RegionalManagerDto build() {
            RegionalManagerDto dto = new RegionalManagerDto();

            dto.setRmId(rmId);
            dto.setUserId(userId);
            dto.setAddress(address);

            dto.setUsername(username);
            dto.setPassword(password);
            dto.setEmail(email);
            dto.setPhone(phone);
            dto.setFullName(fullName);
            dto.setRole(role);
            dto.setStatus(status);
            dto.setUploadedDocs(uploadedDocs);
            dto.setProfileImage(profileImage);

            return dto;
        }
    }

    // ---------------- GETTERS & SETTERS ----------------

    public Integer getRmId() { return rmId; }
    public void setRmId(Integer rmId) { this.rmId = rmId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getUploadedDocs() { return uploadedDocs; }
    public void setUploadedDocs(String uploadedDocs) { this.uploadedDocs = uploadedDocs; }

    public byte[] getProfileImage() { return profileImage; }
    public void setProfileImage(byte[] profileImage) { this.profileImage = profileImage; }
}
