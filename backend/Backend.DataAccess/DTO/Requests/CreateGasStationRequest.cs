namespace Backend.DataAccess.DTO.Requests;

public class CreateGasStationRequest
{
    public required string CarId { get; set; }

    public required int RefilledLiters { get; set; }

    public required DateTime Date { get; set; }

    public required Decimal Price { get; set; }
}